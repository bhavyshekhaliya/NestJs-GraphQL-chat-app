import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

/// Custorm scalar type for the date
@Scalar('DateScalar')
export class DateScalar implements CustomScalar<string, string> {
  description = 'Formatted Date With custom scalar type';

  parseValue(value: string): string {
    // Client -> Server
    return value;
  }
 
  serialize(value: Date): string {
    // Server -> Client
    return this.formatDate(value);
  }

  parseLiteral(ast: ValueNode): string {
    if (ast.kind === Kind.STRING) {
      return ast.value;
    }
    return null;
  }

  /// formate in -> Ex. 12 march,2023
  private formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month},${year}`;
  }
}
     