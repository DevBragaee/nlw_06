import { getCustomRepository } from "typeorm"
import { UsersRepositories } from "../repositories/UsersRepositories"
import { hash } from "bcryptjs"

// Interface User 
interface IUserRequest {
    name: string
    email: string
    // Optional attribute
    admin?: boolean
    password: string  
}


class CreateUserService {

    async execute({ name, email, admin = true, password } : IUserRequest){
        const usersRepository = getCustomRepository(UsersRepositories)
          // Aqui verifica se o tipo de dado que entrou é igual ao esperado    
        if (!email) {
            throw new Error("Email Incorrect")
        }
            /*  Aqui o email ja passou ,é um email valido ,Agora é verificado 
            se o email ja existe no banco da aplicacao  */
        const userAlreadyExists = await usersRepository.findOne({ email })
          // logica de verificacao 
        if (userAlreadyExists) {
            throw new Error("User Already Exists")
        }

        const passwordHash = await hash(password, 8)
                // Cria e salva o usuario 
        const user = usersRepository.create({
            name,
            email,
            admin,
            password: passwordHash
        })

        await usersRepository.save(user)

        return user
    }
}

export { CreateUserService }