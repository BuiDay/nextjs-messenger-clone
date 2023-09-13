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
            orderBy:{name:"asc"},
            select:{
                id:true,
                email:true,
                profilePicture:true,
                about:true,
                name:true,
            }
        })
        const userGroupedByInitialLetter = {};
        users.forEach((user)=>{
            const initialLetter = user.name.charAt(0).toUpperCase();
            if(!userGroupedByInitialLetter[initialLetter]){
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

