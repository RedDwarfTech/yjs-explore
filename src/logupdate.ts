// @ts-ignore
import * as Y from "yjs";

const enc = () => {
    let update = "  ¡ ½Ì  '  users jiangxiaoqiang ' ¡ ½Ì   ids ' ¡ ½Ì   ds   ¡ ½Ì   }¡²ú    æÐ°  !  users jiangxiaoqiang    ¡ ½Ì   } Ì¡á }¡²ú    ¡ ½Ì       745c2986288a4478bf44e14746d22d68 124  æÐ°    ";
    const resEncodedMessage = new TextEncoder().encode(update);

    Y.logUpdate(resEncodedMessage);

}

enc();