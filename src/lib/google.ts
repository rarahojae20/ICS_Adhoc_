// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { v2 } from '@google-cloud/translate';

// import { env } from '../env';

// import ApiError from './api.error';
// import ApiCodes from './api.codes';

// export default class Google {
//     private parent = `projects/${env.google.project.name}/locations/${env.google.location}`;

//     /**
//      * 구글에서 번역을 지원하는 국가들의 코드
//      * 서버 시작시 한번만 불러오기 때문에 이 메서드안에서 예외처리 진행
//      *
//      * 참고자료
//      *
//      * https://cloud.google.com/translate/docs/languages?hl=ko
//      *
//      *x https://cloud.google.com/translate/docs/advanced/discovering-supported-languages-v3?hl=ko
//      *x
//      * @returns result: string[]
//      */
//     getSupportedLanguages = async(): Promise<string[]> => {
//         const result = [];

//         try {
//             const [ response ] = await new v2.Translate().getLanguages();

//             response.forEach(item => {
//                 result.push(item.code);
//             });
//         } catch (e: any) {
//             throw new ApiError(ApiCodes.BAD_REQUEST, e.message);
//         }

//         return result;
//     };

//     translateText = async(contents: string[], targetLanguageCode: string): Promise<string[]> => {
//         const [ response ] = await new v2.Translate().translate(contents, {
//             to: targetLanguageCode, // target types: ja, ko, es
//         });

//         return response;
//     };
// }
