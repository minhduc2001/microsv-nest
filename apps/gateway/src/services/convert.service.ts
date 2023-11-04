import { Injectable } from '@nestjs/common';
import * as path from 'path';

import { promisify } from 'util';
import { exec } from 'child_process';

import * as fs from 'fs';
import * as exc from '@libs/common/api/exception.reslove';

const execPromise = promisify(exec);

type EncodeByResolution = {
  inputPath: string;
  isHasAudio: boolean;
  resolution: {
    width: number;
    height: number;
  };
  outputSegmentPath: string;
  outputPath: string;
  bitrate: {
    360: number;
    720: number;
    1080: number;
    1440: number;
    original: number;
  };
};

@Injectable()
export class ConvertService {
  private async _getBitrateAudio(filePath: string): Promise<number> {
    try {
      const { stdout } = await execPromise(
        `ffprobe -v error -select_streams a:0 -show_entries stream=bit_rate -of default=nw=1:nk=1 ${filePath}`,
      );
      return Number(stdout.trim());
    } catch (e) {
      throw new exc.BadRequest({ message: e?.message });
    }
  }

  public async encodeHLSWithMultipleAudioStreams(
    audioName: string,
  ): Promise<string> {
    try {
      const inputPath = path.join('audio', audioName);
      const bitrate = await this._getBitrateAudio(inputPath);
      const parentFolder = path.join(inputPath, '..');
      const songName = inputPath.split('/').at(-1).split('.')[0];

      const songFolderPath = path.join(parentFolder, songName);
      // const outputSegmentPath = path.join(
      //   parent_folder,
      //   'a%v/fileSequence%d.ts',
      // );
      // const outputPath = path.join(parent_folder, 'a%v/prog_index.m3u8');
      const outputSegmentPath = path.join(
        parentFolder,
        `${songName}`,
        'fileSequence%d.ts',
      );
      const outputPath = path.join(
        parentFolder,
        `${songName}`,
        `${songName}.m3u8`,
      );

      if (!fs.existsSync(songFolderPath)) {
        fs.mkdirSync(songFolderPath);
      }
      const bitrate128 =
        bitrate > MAXIMUM_BITRATE_128K ? MAXIMUM_BITRATE_128K : bitrate;
      const bitrate256 =
        bitrate > MAXIMUM_BITRATE_256K ? MAXIMUM_BITRATE_256K : bitrate;
      const bitrate320 =
        bitrate > MAXIMUM_BITRATE_320K ? MAXIMUM_BITRATE_320K : bitrate;

      let command = `
            ffmpeg -y -i ${inputPath} \
            -map 0:0 \
            -c:a:0 aac -b:a:0 ${bitrate128} \
            -var_stream_map "a:0" \
            -master_pl_name master.m3u8 \
            -f hls -hls_time 6 -hls_list_size 0 \
            -hls_segment_filename "${outputSegmentPath}" \
            ${outputPath}
          `;

      if (bitrate > bitrate128) {
        command = `
              ffmpeg -y -i ${inputPath} \
              -map 0:0 -map 0:1 -map 0:0 -map 0:1 \
              -c:a:0 aac -b:a:0 ${bitrate128} \
              -c:a:1 aac -b:a:1 ${bitrate256} \
              -var_stream_map "a:0,a:1" \
              -master_pl_name master.m3u8 \
              -f hls -hls_time 6 -hls_list_size 0 \
              -hls_segment_filename "${outputSegmentPath}" \
              ${outputPath}
            `;
      }

      if (bitrate > bitrate256) {
        command = `
              ffmpeg -y -i ${inputPath} \
              -map 0:0 -map 0:1 -map 0:0 -map 0:1 -map 0:0 -map 0:1 \
              -c:a:0 aac -b:a:0 ${bitrate128} \
              -c:a:1 aac -b:a:1 ${bitrate256} \
              -c:a:2 aac -b:a:2 ${bitrate320} \
              -var_stream_map "a:0,a:1,a:2" \
              -master_pl_name master.m3u8 \
              -f hls -hls_time 6 -hls_list_size 0 \
              -hls_segment_filename "${outputSegmentPath}" \
              ${outputPath}
            `;
      }

      return new Promise<string>((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
          if (err) {
            reject(err);
          } else {
            console.log('Convert thành công');
            resolve(outputPath);
          }
        });
      });
    } catch (e) {
      throw new exc.BadRequest({ message: e?.message });
    }
  }

  async checkVideoHasAudio(filePath: string) {
    const { $ } = await import('zx');
    const slash = (await import('slash')).default;
    const { stdout } = await $`ffprobe ${[
      '-v',
      'error',
      '-select_streams',
      'a:0',
      '-show_entries',
      'stream=codec_type',
      '-of',
      'default=nw=1:nk=1',
      slash(filePath),
    ]}`;
    return stdout.trim() === 'audio';
  }

  getBitrate = async (filePath: string) => {
    const { $ } = await import('zx');
    const slash = (await import('slash')).default;
    const { stdout } = await $`ffprobe ${[
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-show_entries',
      'stream=bit_rate',
      '-of',
      'default=nw=1:nk=1',
      slash(filePath),
    ]}`;
    return Number(stdout.trim());
  };

  async getResolution(filePath: string) {
    const { $ } = await import('zx');
    const slash = (await import('slash')).default;

    const { stdout } = await $`ffprobe ${[
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-show_entries',
      'stream=width,height',
      '-of',
      'csv=s=x:p=0',
      slash(filePath),
    ]}`;
    const resolution = stdout.trim().split('x');
    const [width, height] = resolution;
    return {
      width: Number(width),
      height: Number(height),
    };
  }

  getWidth(height: number, resolution: { width: number; height: number }) {
    const width = Math.round((height * resolution.width) / resolution.height);
    return width % 2 === 0 ? width : width + 1;
  }

  async encodeMax360({
    bitrate,
    inputPath,
    isHasAudio,
    outputPath,
    outputSegmentPath,
    resolution,
  }: EncodeByResolution) {
    const { $ } = await import('zx');
    const slash = (await import('slash')).default;

    const args = [
      '-y',
      '-i',
      slash(inputPath),
      '-preset',
      'veryslow',
      '-g',
      '48',
      '-crf',
      '17',
      '-sc_threshold',
      '0',
      '-map',
      '0:0',
    ];
    if (isHasAudio) {
      args.push('-map', '0:1');
    }
    args.push(
      '-s:v:0',
      `${this.getWidth(360, resolution)}x360`,
      '-c:v:0',
      'libx264',
      '-b:v:0',
      `${bitrate[360]}`,
      '-c:a',
      'copy',
      '-var_stream_map',
    );
    if (isHasAudio) {
      args.push('v:0,a:0');
    } else {
      args.push('v:0');
    }
    args.push(
      '-master_pl_name',
      'master.m3u8',
      '-f',
      'hls',
      '-hls_time',
      '6',
      '-hls_list_size',
      '0',
      '-hls_segment_filename',
      slash(outputSegmentPath),
      slash(outputPath),
    );

    await $`ffmpeg ${args}`;
    return true;
  }

  encodeMax720 = async ({
    bitrate,
    inputPath,
    isHasAudio,
    outputPath,
    outputSegmentPath,
    resolution,
  }: EncodeByResolution) => {
    const { $ } = await import('zx');
    const slash = (await import('slash')).default;

    const args = [
      '-y',
      '-i',
      slash(inputPath),
      '-preset',
      'veryslow',
      '-g',
      '48',
      '-crf',
      '17',
      '-sc_threshold',
      '0',
    ];
    if (isHasAudio) {
      args.push('-map', '0:0', '-map', '0:1', '-map', '0:0', '-map', '0:1');
    } else {
      args.push('-map', '0:0', '-map', '0:0');
    }
    args.push(
      '-s:v:0',
      `${this.getWidth(360, resolution)}x360`,
      '-c:v:0',
      'libx264',
      '-b:v:0',
      `${bitrate[360]}`,
      '-s:v:1',
      `${this.getWidth(720, resolution)}x720`,
      '-c:v:1',
      'libx264',
      '-b:v:1',
      `${bitrate[720]}`,
      '-c:a',
      'copy',
      '-var_stream_map',
    );
    if (isHasAudio) {
      args.push('v:0,a:0 v:1,a:1');
    } else {
      args.push('v:0 v:1');
    }
    args.push(
      '-master_pl_name',
      'master.m3u8',
      '-f',
      'hls',
      '-hls_time',
      '6',
      '-hls_list_size',
      '0',
      '-hls_segment_filename',
      slash(outputSegmentPath),
      slash(outputPath),
    );

    await $`ffmpeg ${args}`;
    return true;
  };

  encodeMax1080 = async ({
    bitrate,
    inputPath,
    isHasAudio,
    outputPath,
    outputSegmentPath,
    resolution,
  }: EncodeByResolution) => {
    const { $ } = await import('zx');
    const slash = (await import('slash')).default;

    const args = [
      '-y',
      '-i',
      slash(inputPath),
      '-preset',
      'veryslow',
      '-g',
      '48',
      '-crf',
      '17',
      '-sc_threshold',
      '0',
    ];
    if (isHasAudio) {
      args.push('-map', '0:0', '-map', '0:1', '-map', '0:0', '-map', '0:1');
    } else {
      args.push('-map', '0:0', '-map', '0:0');
    }
    args.push(
      '-s:v:0',
      `${this.getWidth(720, resolution)}x720`,
      '-c:v:0',
      'libx264',
      '-b:v:0',
      `${bitrate[720]}`,
      '-s:v:1',
      `${this.getWidth(1080, resolution)}x1080`,
      '-c:v:1',
      'libx264',
      '-b:v:1',
      `${bitrate[1080]}`,
      '-c:a',
      'copy',
      '-var_stream_map',
    );
    if (isHasAudio) {
      args.push('v:0,a:0 v:1,a:1');
    } else {
      args.push('v:0 v:1');
    }
    args.push(
      '-master_pl_name',
      'master.m3u8',
      '-f',
      'hls',
      '-hls_time',
      '6',
      '-hls_list_size',
      '0',
      '-hls_segment_filename',
      slash(outputSegmentPath),
      slash(outputPath),
    );

    await $`ffmpeg ${args}`;
    return true;
  };

  encodeMax1440 = async ({
    bitrate,
    inputPath,
    isHasAudio,
    outputPath,
    outputSegmentPath,
    resolution,
  }: EncodeByResolution) => {
    const { $ } = await import('zx');
    const slash = (await import('slash')).default;

    const args = [
      '-y',
      '-i',
      slash(inputPath),
      '-preset',
      'veryslow',
      '-g',
      '48',
      '-crf',
      '17',
      '-sc_threshold',
      '0',
    ];
    if (isHasAudio) {
      args.push(
        '-map',
        '0:0',
        '-map',
        '0:1',
        '-map',
        '0:0',
        '-map',
        '0:1',
        '-map',
        '0:0',
        '-map',
        '0:1',
      );
    } else {
      args.push('-map', '0:0', '-map', '0:0', '-map', '0:0');
    }
    args.push(
      '-s:v:0',
      `${this.getWidth(720, resolution)}x720`,
      '-c:v:0',
      'libx264',
      '-b:v:0',
      `${bitrate[720]}`,
      '-s:v:1',
      `${this.getWidth(1080, resolution)}x1080`,
      '-c:v:1',
      'libx264',
      '-b:v:1',
      `${bitrate[1080]}`,
      '-s:v:2',
      `${this.getWidth(1440, resolution)}x1440`,
      '-c:v:2',
      'libx264',
      '-b:v:2',
      `${bitrate[1440]}`,
      '-c:a',
      'copy',
      '-var_stream_map',
    );
    if (isHasAudio) {
      args.push('v:0,a:0 v:1,a:1 v:2,a:2');
    } else {
      args.push('v:0 v:1 v2');
    }
    args.push(
      '-master_pl_name',
      'master.m3u8',
      '-f',
      'hls',
      '-hls_time',
      '6',
      '-hls_list_size',
      '0',
      '-hls_segment_filename',
      slash(outputSegmentPath),
      slash(outputPath),
    );

    await $`ffmpeg ${args}`;
    return true;
  };

  async encodeMaxOriginal({
    bitrate,
    inputPath,
    isHasAudio,
    outputPath,
    outputSegmentPath,
    resolution,
  }: EncodeByResolution) {
    const { $ } = await import('zx');
    const slash = (await import('slash')).default;

    const args = [
      '-y',
      '-i',
      slash(inputPath),
      '-preset',
      'veryslow',
      '-g',
      '48',
      '-crf',
      '17',
      '-sc_threshold',
      '0',
    ];
    if (isHasAudio) {
      args.push(
        '-map',
        '0:0',
        '-map',
        '0:1',
        '-map',
        '0:0',
        '-map',
        '0:1',
        '-map',
        '0:0',
        '-map',
        '0:1',
      );
    } else {
      args.push('-map', '0:0', '-map', '0:0', '-map', '0:0');
    }
    args.push(
      '-s:v:0',
      `${this.getWidth(720, resolution)}x720`,
      '-c:v:0',
      'libx264',
      '-b:v:0',
      `${bitrate[720]}`,
      '-s:v:1',
      `${this.getWidth(1080, resolution)}x1080`,
      '-c:v:1',
      'libx264',
      '-b:v:1',
      `${bitrate[1080]}`,
      '-s:v:2',
      `${resolution.width}x${resolution.height}`,
      '-c:v:2',
      'libx264',
      '-b:v:2',
      `${bitrate.original}`,
      '-c:a',
      'copy',
      '-var_stream_map',
    );
    if (isHasAudio) {
      args.push('v:0,a:0 v:1,a:1 v:2,a:2');
    } else {
      args.push('v:0 v:1 v2');
    }
    args.push(
      '-master_pl_name',
      'master.m3u8',
      '-f',
      'hls',
      '-hls_time',
      '6',
      '-hls_list_size',
      '0',
      '-hls_segment_filename',
      slash(outputSegmentPath),
      slash(outputPath),
    );

    await $`ffmpeg ${args}`;
    return true;
  }

  async encodeHLSWithMultipleVideoStreams(inputPath: string) {
    const [bitrate, resolution] = await Promise.all([
      this.getBitrate(inputPath),
      this.getResolution(inputPath),
    ]);

    const prefix_folder = inputPath.split('/').at(-1)?.split('.').at(0) || '';
    const parent_folder = path.join(inputPath, '..');
    const outputSegmentPath = path.join(
      parent_folder,
      prefix_folder,
      'v%v/fileSequence%d.ts',
    );
    const outputPath = path.join(
      parent_folder,
      prefix_folder,
      'v%v/prog_index.m3u8',
    );
    const bitrate360 =
      bitrate > MAXIMUM_BITRATE_360P ? MAXIMUM_BITRATE_360P : bitrate;
    const bitrate720 =
      bitrate > MAXIMUM_BITRATE_720P ? MAXIMUM_BITRATE_720P : bitrate;
    const bitrate1080 =
      bitrate > MAXIMUM_BITRATE_1080P ? MAXIMUM_BITRATE_1080P : bitrate;
    const bitrate1440 =
      bitrate > MAXIMUM_BITRATE_1440P ? MAXIMUM_BITRATE_1440P : bitrate;
    const isHasAudio = await this.checkVideoHasAudio(inputPath);
    let encodeFunc = this.encodeMax360;
    if (resolution.height > 360) {
      encodeFunc = this.encodeMax720;
    }
    if (resolution.height > 720) {
      encodeFunc = this.encodeMax1080;
    }
    if (resolution.height > 1080) {
      encodeFunc = this.encodeMax1440;
    }
    if (resolution.height > 1440) {
      encodeFunc = this.encodeMaxOriginal;
    }
    await encodeFunc({
      bitrate: {
        360: bitrate360,
        720: bitrate720,
        1080: bitrate1080,
        1440: bitrate1440,
        original: bitrate,
      },
      inputPath,
      isHasAudio,
      outputPath,
      outputSegmentPath,
      resolution,
    });
    return true;
  }
}
