// importing tools
import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Code from "@editorjs/code";
import Header from "@editorjs/header"
import Quote from "@editorjs/quote";
import Underline from "@editorjs/underline";
import ChangeCase from "editorjs-change-case";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import AlignmentBlockTune from "editorjs-text-alignment-blocktune";
import { uploadImage } from "../common/aws";

const uploadImageByFile = (e) => {
    return uploadImage(e).then(url => {
        if (url) {
            return {
                success: 1,
                file: { url }
            }
        }
    })
}


const uploadImageByURL = (e) => {
    let link = new Promise((resolve, reject) => {
        try {
            resolve(e)
        }
        catch (err) {
            reject(err)
        }
    })

    return link.then(url => {
        return {
            success: 1,
            file: { url }
        }
    })
}

export const tools = {
    embed: Embed,
    textAlignment: {
        class: AlignmentBlockTune,
        config: {
            default: "left",
            options: ["left", "center", "right"]
        }
    },
    list: {
        class: List,
        inlineToolbar: true
    },
    image: {
        class: Image,
        config: {
            uploader: {
                uploadByUrl: uploadImageByURL,
                uploadByFile: uploadImageByFile
            }
        }
    },
    header: {
        class: Header,
        inlineToolbar: true,
        tunes: ["textAlignment"],
        config: {
            placeholder: "Type Heading....",
            levels: [2, 3, 4],
            defaultLevel: 2,
        }
    },
    quote: {
        class: Quote,
        inlineToolbar: true
    },
    inlineCode: InlineCode,
    code: Code,
    marker: Marker,
    underline: Underline,
    changeCase: ChangeCase,
}
