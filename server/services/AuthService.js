import getPrismaInstance from '../utils/PrismaClient.js'

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
        await prisma.user.create({
            data: {
                email, name, about, profilePicture
            }
        })
        resolve({
            msg: "Success",
            status: true,
            data:data
        })
    } catch (error) {
        reject(error)
    }
})
