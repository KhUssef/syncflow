import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly jwtSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.jwtSecret = this.configService.getJwtConfig().jwtSecret;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const type = context.getType();

    if (type === 'http') {
      
      return super.canActivate(context) as Promise<boolean>;
    }

    if (type === 'ws') {
      console.log("jwtauthguardactivated")
      // For WebSocket, custom JWT validation
      const client: Socket = context.switchToWs().getClient();
      const token = client.handshake.auth.token;
      if (!token) {
        throw new UnauthorizedException('No token provided in WebSocket handshake');
      }
      try {
        // Handle multiple tokens case
        if (Array.isArray(token)) {
          throw new UnauthorizedException('Multiple tokens provided in WebSocket handshake');
        }
        
        const payload = this.jwtService.verify(token, { secret: this.jwtSecret });
        console.log("token:", token);
        client.data.user = payload;
        console.log("ws payload:", payload);
        return true;
      } catch (err) {
        console.log("ws token error:", err);
        throw new UnauthorizedException('Invalid WebSocket token');
      }
    }

    throw new UnauthorizedException('Unknown context type');
  }
}
