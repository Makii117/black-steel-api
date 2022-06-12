import prisma from '../config/client.js'
import bcrypt from 'bcryptjs'
import jwt from '../utils/jwt.js'
import createError from 'http-errors';

class AuthService {


    static async register(data) {
          const { email } = data;
          data.password = bcrypt.hashSync(data.password, 8);
            try{
          const user = await prisma.user.create({
              data
          })
          data.accessToken = await jwt.signAccessToken(user);
          
          return data;
        }catch(e){
          throw createError.NotAcceptable("User alreay exists")
        }
        }

      static async login(data) {
        const { email, password } = data;
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            throw createError.NotFound('User not registered')
        }
        const checkPassword = bcrypt.compareSync(password, user.password)
        if (!checkPassword) throw createError.Unauthorized('Email address or password not valid')
        delete user.password
        const accessToken = await jwt.signAccessToken(user)
        return { ...user, accessToken }
    }
    static async all() {
        const allUsers = await prisma.user.findMany();
        return allUsers;
    }





  }
  
export default AuthService;