import { Request, Response } from 'express';
import * as passport from 'passport';
import { PrincipalConfig, AuthContext } from '@travetto/auth';

import { AuthProvider } from '../../src';

export class AuthPassportProvider<U> extends AuthProvider<U> {
  constructor(private strategyName: string, private strategy: passport.Strategy, private principal: PrincipalConfig<U>) {
    super();
    passport.use(this.strategyName, this.strategy);
  }

  async login(req: Request, res: Response) {
    return new Promise<AuthContext<U> | undefined>((resolve, reject) => {
      passport.authenticate(this.strategyName, (err, user, ...rest) => {
        if (err) {
          reject(err);
        } else {
          // Remove proflie fields from passport
          delete user._json;
          delete user._raw;
          delete user.provider;

          resolve(this.principal.toContext(user));
        }
      })(req, res);
    });
  }
}