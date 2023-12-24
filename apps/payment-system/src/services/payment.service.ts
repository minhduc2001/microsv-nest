import {
  CreatePackageDto,
  CreatePaymentDto,
  ListPackageDto,
  UpdatePackageDto,
  UpdateStatePackageDto,
} from '@libs/common/dtos/payment-system.dto';
import { Package } from '@libs/common/entities/payment-system/package.entity';
import { User } from '@libs/common/entities/user/user.entity';
import { EState } from '@libs/common/enums/common.enum';
import { ERole } from '@libs/common/enums/role.enum';
import { BaseService } from '@libs/common/services/base.service';
import { PaginateConfig } from '@libs/common/services/paginate';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Not, Repository } from 'typeorm';
import * as excRpc from '@libs/common/api';
import { Payment } from '@libs/common/entities/payment-system/payment.entity';
import { MomoPayment } from 'momo-payment-api';
import { Redis } from 'ioredis';
import { envService } from '@libs/env';
import {
  EPaymentMethod,
  EStatePayment,
} from '@libs/common/enums/payment-system.enum';
import { PackageService } from './package.service';
import {
  IResponsePayment,
  IResponseSuccessPayment,
} from 'momo-payment-api/src/type';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { ClientProxy } from '@nestjs/microservices';
import { USER_MESSAGE_PATTERNS } from '@libs/common/constants/rabbit-patterns.constant';

@Injectable()
export class PaymentService extends BaseService<Payment> {
  private momoPayment: MomoPayment;
  private redisSubscriber: Redis;
  constructor(
    @InjectRepository(Payment)
    protected readonly paymentRepository: Repository<Payment>,
    private readonly packageService: PackageService,
    @Inject(RabbitServiceName.USER)
    private readonly userClientProxy: ClientProxy,
  ) {
    super(paymentRepository);

    this.redisSubscriber = new Redis();
    this.momoPayment = new MomoPayment(
      envService.MOMO_PARTNER_CODE,
      envService.MOMO_ACCESS_KEY,
      envService.MOMO_SECRET_KEY,
      envService.MOMO_ENVIRONMENT,
    );
  }

  async getPayment(id: number) {
    const payment = await this.repository.findOne({ where: { id: id } });
    if (!payment)
      throw new excRpc.BadRequest({ message: 'không tồn tại thanh toán này' });
    return payment;
  }

  async getPaymentWithOrderId(orderId: string) {
    const payment = await this.repository.findOne({
      where: { orderId: orderId },
      relations: { package: true },
    });
    if (!payment)
      throw new excRpc.BadRequest({ message: 'không tồn tại thanh toán này' });
    return payment;
  }

  async createPayment(dto: CreatePaymentDto) {
    try {
      const pack = await this.packageService.getPackageActive(dto.packageId);
      const date = new Date().getTime();
      const payment = await this.repository.save({
        amount: pack.price,
        state: EStatePayment.PENDDING,
        paymentMethod: EPaymentMethod.MOMO,
        userId: dto.user.id,
        username: dto.user.username,
        packageName: pack.name,
        package: pack,
        golds: pack.golds,
        price: pack.price,
        requestId: `REQ${dto.user.id}${date}`,
        orderId: `ORD${dto.user.id}${date}`,
      });

      let responsePayment = { payUrl: '', deeplink: '' };

      switch (dto.paymentMethod) {
        case EPaymentMethod.MOMO:
          const resp: IResponsePayment = await this.momoPayment.createPayment({
            requestId: payment.requestId,
            orderId: payment.orderId,
            amount: payment.package.price,
            orderInfo: `Thanh toán Momo`,
            ipnUrl: 'zappy://ipnpayment',
            redirectUrl: 'zappy://payment',
          });
          responsePayment = resp;
          break;
        case EPaymentMethod.VNPAY:
          //   const res = await this.vnpayService.createPayment({
          //     amount: payment.package.amount,
          //     orderId: payment.orderId,
          //     orderInfo: `Thanh toán VNPAY`,
          //   });
          //   responsePayment = res;
          break;
        default:
          break;
      }

      //   await this.redisService.setWithExpiration(
      //     `transaction:${payment.id}`,
      //     payment,
      //     10 * 60,
      //   );

      //   await this.mailerService.sendMail(
      //     dto.user.email,
      //     'Thanh toán gói cước',
      //     responsePayment.payUrl,
      //   );

      return responsePayment.deeplink;
    } catch (e) {
      throw new excRpc.BadRequest({ message: e.message });
    }
  }

  async cancelPayment(id: number) {
    try {
      const payment = await this.getPayment(id);
      payment.state = EStatePayment.REJECT;
      await payment.save();
      return true;
    } catch (e) {
      throw new excRpc.BadRequest({ message: e.message });
    }
  }

  async confirmPayment(body: IResponseSuccessPayment, user: User) {
    try {
      if (body.resultCode != 0) return false;
      const payment = await this.getPaymentWithOrderId(body.orderId);
      if (
        payment.state == EStatePayment.REJECT ||
        payment.state == EStatePayment.DONE
      ) {
        const date = new Date().getTime();
        const res = await this.momoPayment.refundPayment({
          requestId: `REQ${payment.userId}${date}`,
          orderId: `ORD${payment.userId}${date}`,
          transId: body.transId,
          amount: payment.price,
        });

        return false;
      }
      payment.state = EStatePayment.DONE;
      await payment.save();

      // set gói cho user
      // const user = await this.userRepository.findOne({
      //   where: { id: payment.userId },
      // });

      await this.userClientProxy
        .send<any>(USER_MESSAGE_PATTERNS.UPDATE_GOLDS_PAYMENT, {
          userId: payment.userId,
          golds: payment.golds,
        })
        .toPromise();

      // user.packageId = payment.package.id;`
      // const date = new Date().getTime();
      // await user.save();

      // khởi tạo thời gian hủy gói
      // await this.subscriptionService.createSubscription({
      //   userId: user.id,
      //   delay: Number(user.packageExpire) - date,
      // });
      return user.golds + payment.golds;
    } catch (e) {
      throw new excRpc.BadRequest({ message: e.message });
    }
  }
}
