import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashService {
  private readonly saltRounds = 8;

  async hash(plainValue: string): Promise<string> {
    const hashedValue = await bcrypt.hash(plainValue, this.saltRounds);
    return hashedValue;
  }

  async compare(plainValue: string, hashedValue: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(plainValue, hashedValue);
    return isMatch;
  }
}
