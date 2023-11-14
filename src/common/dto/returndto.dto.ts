import { ICombinedInterface } from "src/types/core/noticecscomment";
import { BoardDto } from "./board.dto";
import { CommentsDto } from "./comments.dto";
import { CsDto } from "./customerservice.dto";


export class ReturnDto {
  public static returnDto(board: ICombinedInterface, files: any[], index?: number, ): BoardDto | CsDto {
      if (board.type === 'cs') {
          return new CsDto(board, files, index,);
      } else {
          return new BoardDto(board, files, index);
      }
  }
  
}

// export function returndto(board: ICombinedInterface, files: any[]): BoardDto | CsDto {
//     if (board.type === 'cs') {
//       return new CsDto(board, files);
//     } else {
//       return new BoardDto(board, files);
//     }
//   }
  