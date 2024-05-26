import { Controller, Get } from "@nestjs/common";

@Controller('/app') // add depth to controller's url
export class AppController {
    @Get('/asdf')   // add depth to GET url
    getRootRoute() {
        return 'hi there!'
    }

    @Get('/bye')
    getByeThere() {
        return 'bye there!'
    }
}
