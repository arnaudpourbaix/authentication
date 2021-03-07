import { ConflictException, HttpStatus } from '@nestjs/common';

export class GoogleConflictException extends ConflictException {}
