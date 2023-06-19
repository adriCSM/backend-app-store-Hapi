class UserHandler {
  constructor(usersService, validator) {
    this.usersService = usersService;
    this.validator = validator;
  }

  async postAdminHandler(request, h) {
    await this.usersService.addAdmin();
    return h
      .response({
        status: 'success',
        message: 'API store can be used',
      })
      .code(200);
  }

  async postUserHandler(request, h) {
    this.validator.validateUserPayload(request.payload);
    const userId = await this.usersService.addUser(request.payload);
    const response = h
      .response({
        status: 'success',
        message: 'Berhasil menambahkan user',
        data: {
          userId,
        },
      })
      .code(201);
    return response;
  }
}

module.exports = UserHandler;
