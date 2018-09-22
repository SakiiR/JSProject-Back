import { Types } from 'koa-smart';
import jwt from "jsonwebtoken";
import Route from './Route';
import User from '../models/Room';
import Token from '../models/Token';
import Message from '../models/Message';
import { hashPassword, generateSalt, compareHash } from '../utils/hash';

export default class RouteAuth extends Route {
	constructor(params) {
		super({ ...params });
	}

	async isAuthorized(ctx) {
	    token = Token.findOne({value: ctx.headers.authorization});
	    if (token === null)
	    	return false;
	    return true;
    }

	@Route.Get({
		accesses: [isAuthorized],
		path: '/rooms/'
	})
	async list(ctx) {
		let response = null;
		const error = 'No room found';
		try {
			const rooms = await Room.find({});
			if (rooms === null) throw error;
			response = {
				rooms: rooms
			};
		} catch (err) {
			return this.send(ctx, 404, err, null);
		}
		this.sendOk(ctx, response, "Successfully read rooms");
	}

	@Route.Get({
		accesses: [isAuthorized],
		path: '/rooms/:id/messages'
	})
	async list(ctx) {
		let response = null;
		const error = 'No message found';
		try {
			const messages = await Message.find({ room: ctx.params.id });
			if (messages === null) throw error;
			response = {
				messages: messages
			};
		} catch (err) {
			return this.send(ctx, 404, err, null);
		}
		this.sendOk(ctx, response, "Successfully read messages from room " + ctx.params.id);
	}

	@Route.Post({
		accesses: [isAuthorized],
		path: '/rooms/',
		bodyType: Types.object().keys({
			creator: Types.number().integer().required(),
			name: Types.string().required(),
			description: Types.string().required()
		})
	})
	async create(ctx) {
		try {
			const body = this.body(ctx);
			const room = await Room.findOne({name: body.name});
			if (room !== null)
				throw "This room already exists !";
			const salt = "";
			const password = "";
			if (body.private === true) {
				const salt = generateSalt();
				const password = await hashPassword(body.password + salt);
			}
			const result = await Room.create({ creator: body.creator, name: body.name, description: body.description, private: body.private, password: password, salt: salt});
			console.log("Result: ", result);
		} catch (err) {
			return this.send(ctx, 401, err, null);
		}
		this.sendOk(ctx, null, "Room created");
	}

	@Route.Delete({
		accesses: [isAuthorized],
		path: '/rooms/:id'
	})
	async read(ctx) {
		const error = 'This room doesn\'t exist';
		try {
			const rooms = await Room.findByIdAndRemove({id: ctx.params.id});
		} catch (err) {
			return this.send(ctx, 404, err, null);
		}
		this.sendOk(ctx, response, "Successfully deleted room");
	}
}
