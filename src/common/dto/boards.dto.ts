import { BoardDto } from './board.dto';
import { IBoard } from '../../types/board';
import { PaginationVo } from '../vo/pagination.vo';
import { CsDto } from './customerservice.dto';
import { ICombinedInterface } from '../../../src/types/core/noticecscomment';



export class  BoardsDto {
    public count: number;
    public board: (BoardDto | CsDto )[]; //수정

    constructor(count: number, boards: ICombinedInterface[], param?: PaginationVo) {
        this.count = count;
        this.board = boards.map((board, index) => { //새로운 boardDto객체를 생성해서 변환
            const page = param?.page || 1; //pagerkdlTdmaus 
            const size = param?.size ; //param객체가 존재하면 값을 사용하면 아니면 기본값으로 1과 cs로

            if (board.type === 'cs') {
                return new CsDto(board, null, (count - (size * (page - 1))) - index);
              } else {
                return new BoardDto(board, null, (count - (size * (page - 1))) - index);
              }
            });
          }
        }
        











// export class BoardsDto {
//   public count: number;
//   public board: (BoardDto | CsDto)[];

//   constructor(count: number, boards: ICombinedInterface[], param?: PaginationVo) {
//     this.count = count;
//     this.board = boards.map((board, index) => {
//       const page = param?.page || 1;
//       const size = param?.size;

//       if (board.type === 'cs') {
//         const csDto = new CsDto(board, null, (count - (size * (page - 1))) - index);
//         return csDto;
//       } else {
//         const boardDto = new BoardDto(board, null, (count - (size * (page - 1))) - index);
//         return boardDto;
//       }
//     });
//   }
// }
