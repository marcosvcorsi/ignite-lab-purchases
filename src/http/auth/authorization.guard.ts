import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import jwt from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';
import { promisify } from 'node:util';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private logger;
  private audience: string;
  private domain: string;

  constructor(configService: ConfigService) {
    this.logger = new Logger(AuthorizationGuard.name);

    this.audience = configService.get('AUTH0_AUDIENCE');
    this.domain = configService.get('AUTH0_DOMAIN');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const httpContext = context.switchToHttp();

    // const req = httpContext.getRequest();
    // const res = httpContext.getResponse();

    const { req, res } = GqlExecutionContext.create(context).getContext();

    const checkJwt = promisify(
      jwt({
        secret: expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `https://${this.domain}/.well-known/jwks.json`,
        }),
        audience: this.audience,
        issuer: this.domain,
        algorithms: ['RS256'],
      }),
    );

    try {
      await checkJwt(req, res);

      return true;
    } catch (error) {
      this.logger.error(error);

      throw new UnauthorizedException();
    }
  }
}
