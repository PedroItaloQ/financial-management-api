import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../users/users.schema'; // Importe o tipo correto

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    console.log('1. Email recebido:', email);
    console.log('2. Senha recebida:', pass);
  
    const user = await this.usersService.findOneByEmail(email);
    console.log('3. Usuário encontrado:', user);
  
    if (!user) {
      console.log('4. Usuário não encontrado');
      return null;
    }
  
    const passwordValid = await bcrypt.compare(pass, user.password);
    console.log('5. Senha válida?', passwordValid);
  
    if (user && passwordValid) {
      const userDocument = user as UserDocument;
      const { password, ...result } = userDocument.toObject();
      console.log('6. Usuário autenticado:', result);
      return result;
    }
  
    console.log('7. Autenticação falhou');
    return null;
  }
  
}
