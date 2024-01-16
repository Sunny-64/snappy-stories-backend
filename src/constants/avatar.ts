export interface IDefaultAvatar {
    [key: string]: string;
}

export const defaultAvatars:IDefaultAvatar = {
    panda : 'panda-reader.png', 
    cat : 'cat-reader.png', 
    owl : 'owl-reader.png', 
    astronaut : 'astronaut-reader.png', 
    penguin : 'penguin-reader.png', 
}

export const defaultAvatarKeys: string [] = Object.keys(defaultAvatars); 