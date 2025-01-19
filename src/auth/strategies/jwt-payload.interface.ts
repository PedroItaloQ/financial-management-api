export interface JwtPayload {
    username: string; // Nome de usuário, ou outro identificador único
    sub: string;      // "sub" geralmente é o identificador único do usuário (por exemplo, ID do usuário no banco de dados)
    iat?: number;     // (opcional) "iat" é a data de criação do token (pode ser usada para auditoria ou expiração)
  }
  