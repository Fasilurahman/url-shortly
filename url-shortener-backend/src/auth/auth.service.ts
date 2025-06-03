import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { User } from "./user.schema";


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService
    ) {}

    async register(name: string, email: string, password: string){
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new Error('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const user = new this.userModel({name, email, password: hashedPassword})
        return user.save()
    }

    async login(email: string, password: string){
        const user = await this.userModel.findOne({email})
        
        if(!user)throw new UnauthorizedException('Invalid credentials')
        const isMatch = await bcrypt.compare(password, user.password);
        
        if(!isMatch) throw new UnauthorizedException('Invalid credentials')

        const payload = {
            sub: user._id,
            email: user.email,
            name: user.name,
        };


        return {
            access_token: await this.jwtService.signAsync(payload),
        }
    }

}