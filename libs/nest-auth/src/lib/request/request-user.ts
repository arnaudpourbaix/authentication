import { JwtPayload } from '@authentication/common-auth';
import { Request } from '@nestjs/common';

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
