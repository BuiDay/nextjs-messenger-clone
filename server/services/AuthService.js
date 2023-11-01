import getPrismaInstance from '../utils/PrismaClient.js'
import { generateToken04 } from '../utils/TokenGenerator.js'


export const checkUserService = (email) => new Promise(async (resolve, reject) => {
    try {
        const prisma = getPrismaInstance()
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            resolve({
                msg: "User not found",
                status: false
            })
        } else {
            resolve({
                msg: "User found",
                status: true,
                data: user
            })
        }
    } catch (error) {
        reject(error)
    }
})

export const onboardUserService = (email, name, about, profilePicture) => new Promise(async (resolve, reject) => {
    try {

        const prisma = getPrismaInstance();
        const data = await prisma.user.create({
            data: {
                email, name, about, profilePicture
            }
        })
        resolve({
            msg: "Success",
            status: true,
            data: data
        })
    } catch (error) {
        reject(error)
    }
})

export const getAllUserService = () => new Promise(async (resolve, reject) => {
    try {
        const prisma = getPrismaInstance();
        const users = await prisma.user.findMany({
            orderBy: { name: "asc" },
            select: {
                id: true,
                email: true,
                profilePicture: true,
                about: true,
                name: true,
            },
        })
        const userGroupedByInitialLetter = {};
        users.forEach((user) => {
            const initialLetter = user.name.charAt(0).toUpperCase();
            if (!userGroupedByInitialLetter[initialLetter]) {
                userGroupedByInitialLetter[initialLetter] = [];
            }
            userGroupedByInitialLetter[initialLetter].push(user);
        })
        resolve({
            msg: "Success",
            status: true,
            data: userGroupedByInitialLetter
        })
    } catch (error) {
        reject(error)
    }
})

export const generateTokenService = (userId) => new Promise((resolve, reject) => {
    try {
        const appId = parseInt(process.env.ZEGO_APPID);
        const serverSecret = process.env.ZEGO_SERVERSECRET;
        const effectiveTime = 3600;
        const payload = " ";
        const token = generateToken04(appId, userId, serverSecret, effectiveTime, payload);
        resolve({
            msg: "Success",
            status: true,
            token: token
        })
    } catch (error) {
        reject(error)
    }
})

export const reactionMessageService = (userId, messageId, typeReact) => new Promise(async (resolve, reject) => {
    try {
        const prisma = getPrismaInstance();
        const reactionArr = await prisma.reaction.findMany({
            where: { messagesId: messageId, userId }
        })
        if (reactionArr.length === 0) {
            await prisma.reaction.create({
                data: {
                    type: typeReact,
                    reactionUser: { connect: { id: parseInt(userId) } },
                    reactionMessages: { connect: { id: parseInt(messageId) } },
                }
            })
        }else{
            if(reactionArr[0].type === typeReact){
                await prisma.reaction.delete({
                    where: { id: reactionArr[0].id },
                })
            }
            else{
                await prisma.reaction.update({
                    where: { id:  reactionArr[0].id},
                    data: { type: typeReact},
                })
            }
        }
        resolve({
            msg: "Success",
            status: true,
        })
    } catch (error) {
        console.log(error)
        reject(error)
    }
})

