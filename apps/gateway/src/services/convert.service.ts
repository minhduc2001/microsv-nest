import { Injectable } from '@nestjs/common';
import * as path from 'path';

import { promisify } from 'util';
import { exec } from 'child_process';

import * as fs from 'fs';
import * as exc from '@libs/common/api/exception.reslove';
import slash from 'slash';

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

const MAXIMUM_BITRATE_128K = 128 * 10 ** 3; // 128 Kbps
const MAXIMUM_BITRATE_256K = 256 * 10 ** 3; // 256 Kbps
const MAXIMUM_BITRATE_320K = 320 * 10 ** 3; // 320 Kbps
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
}
