import getPrismaInstance from '../utils/PrismaClient.js'
import { renameSync } from 'fs'

export const addMessageService = (message, from, to) => new Promise(async (resolve, reject) => {
    try {
        const prisma = getPrismaInstance();
        const getUser = onlineUsers.get(to);
        const newMessage = await prisma.messages.create({
            data: {
                message,
                sender: { connect: { id: parseInt(from) } },
                reciever: { connect: { id: parseInt(to) } },
                messageStatus: getUser ? "delivered" : "sent"
            },
            include: {
                sender: true,
                reciever: true
            }
        })
        resolve({
            msg: "Success",
            status: true,
            message: newMessage
        })

    } catch (error) {
        reject(error)
    }
})

export const getMessagesService = (from, to) => new Promise(async (resolve, reject) => {
    try {
        const prisma = getPrismaInstance();
        const messages = await prisma.messages.findMany({
            where: {
                OR: [
                    {
                        senderId: parseInt(to),
                        recieverId: parseInt(from)
                    },
                    {
                        senderId: parseInt(from),
                        recieverId: parseInt(to)
                    }
                ]
            },
            orderBy: {
                id: "asc"
            }
        })
        const unreadMessages = [];
        messages.forEach = (message, index) => {
            if (
                message.messageStatus !== "read" &&
                message.senderId === parseInt(to)
            ) {
                message[index].messageStatus = "read";
                unreadMessages.push(message.id);
            }
        }
        await prisma.messages.updateMany({
            where: {
                id: { in: unreadMessages }
            },
            data: {
                messageStatus: 'read'
            }
        })

        resolve({
            msg: "Success",
            status: true,
            messages: messages
        })
    } catch (error) {
        reject(error)
    }
})

export const getInitialContactswithMessagesService = (userId) => new Promise(async (resolve, reject) => {
    try {
        const prisma = getPrismaInstance();
        const user = await prisma.user.findUnique(
            {
                where: { id: userId },
                include: {
                    sentMessages: {
                        include: {
                            sender: true,
                            reciever: true,
                        },
                        orderBy: {
                            createdAt: "desc"
                        }
                    },
                    revieverMessages: {
                        include: {
                            sender: true,
                            reciever: true,
                        },
                        orderBy: {
                            createdAt: "desc"
                        }
                    },

                }
            }
        )
        const messages = [...user.sentMessages, ...user.revieverMessages];
        messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        const users = new Map();
        const messageStatusChange = [];

        messages.forEach((msg) => {
            const isSender = msg.senderId === userId;
            const calculatedId = isSender ? msg.recieverId : msg.senderId;
            if (msg.messageStatus === 'sent') {
                messageStatusChange.push(msg.id)
            }
            if (!users.get(calculatedId)) {
                const { id, senderId, recieverId, type, message, messageStatus, createdAt } = msg;
                let user = {
                    messageId: id, senderId, recieverId, type, message, messageStatus, createdAt
                }
                if (isSender) {
                    user = { ...user, ...msg.reciever, totalUnreadMessages: 0 }
                } else {
                    user = { ...user, ...msg.sender, totalUnreadMessages: messageStatus !== 'read' ? 1 : 0 }
                }
                users.set(calculatedId, { ...user });
            } else if (msg.messageStatus !== "read" && !isSender) {
                const user = users.get(calculatedId);
                users.set(calculatedId, {
                    ...user,
                    totalUnreadMessages: user.totalUnreadMessages + 1
                })
            }
        })
        if (messageStatusChange.length) {
            await prisma.messages.updateMany({
                where: {
                    id: { in: messageStatusChange }
                },
                data: {
                    messageStatus: 'delivered'
                }
            })
        }
        resolve({
            msg: "Success",
            status: true,
            data: {
                user: Array.from(users.values()),
                onlineUsers: Array.from(onlineUsers.keys())
            }
        })
    } catch (error) {
        reject(error)
    }
})

export const addImageMessageService = (file, from, to) => new Promise(async (resolve, reject) => {
    try {
        let fileName = "uploads/images/"+file.originalname;
        renameSync(file.path, fileName);
        const prisma = getPrismaInstance();
        const message = await prisma.messages.create({
            data: {
                message: fileName,
                sender: { connect: { id: parseInt(from) } },
                reciever: { connect: { id: parseInt(to) } },
                type: "image"
            }
        })
        resolve({
            msg: "Success",
            status: true,
            message: message
        })

    } catch (error) {
        console.log(error)
        reject(error)
    }
})