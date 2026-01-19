import { Controller, UseGuards, Sse, Get, Param, Body, Patch, Delete, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConnectedUser } from '../auth/decorator/user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { Observable, of } from 'rxjs';
import { UserEvents } from './user.events';
import { User } from './entities/user.entity';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/enum/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userEvents: UserEvents,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('deleted')
  async findDeleted(): Promise<User[]> {
    return this.userService.findDeleted();
  }

  @Get('company')
  async getUsersByCompany(@ConnectedUser() user: JwtPayload): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('company/:companyId')
  async getUsersByCompanyId(@Param('companyId') companyId: string): Promise<User[]> {
    return this.userService.getUsersByCompany(+companyId);
  }

  @Get('by-username/:username/:companyId')
  async findByUsername(
    @Param('username') username: string,
    @Param('companyId') companyId: string
  ): Promise<User | null> {
    return this.userService.findOneByUsername(username, +companyId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(+id);
  }

  @Sse('events')
  events(@ConnectedUser() user: JwtPayload): Observable<any> {
    if (!user.sub) {
      return of({ type: 'error', data: 'No user ID found' });
    }
    const stream = this.userEvents.getUserStream(user.sub.toString());
    if (!stream) {
      return of({ type: 'error', data: 'Stream not available' });
    }
    return stream;
  }

  @Get('user-names')
  @Roles([Role.MANAGER])
  async getUserNames(@ConnectedUser() user: JwtPayload): Promise<string[]> {
    const res = await this.userService.getUsernames(user.companyCode);
    console.log(res);
    return res;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @ConnectedUser() user: JwtPayload
  ): Promise<User> {
    const updatedUser = await this.userService.update(+id, updateUserDto, user);
    this.eventEmitter.emit('user.updated', updatedUser);
    return updatedUser;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @ConnectedUser() user: JwtPayload) {
    const userToDelete = await this.userService.findOne(+id);
    await this.userService.remove(+id, user);
    this.eventEmitter.emit('user.deleted', userToDelete);
    return { success: true };
  }

  @Post(':id/recover')
  async recover(@Param('id') id: string, @ConnectedUser() user: JwtPayload): Promise<User> {
    const recoveredUser = await this.userService.recover(+id, user);
    this.eventEmitter.emit('user.recovered', recoveredUser);
    return recoveredUser;
  }
}
