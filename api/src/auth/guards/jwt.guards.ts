import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    const userIdRequest = context.switchToHttp().getRequest().body.user_id;

    if (!userIdRequest)
      throw new UnauthorizedException(
        "Ajouter un ID dans le body de la requete",
      );

    if (userIdRequest !== user.id) {
      throw new UnauthorizedException("ID utilisateur non valide");
    }

    return user;
  }
}
