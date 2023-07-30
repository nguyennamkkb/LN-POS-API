import { Controller, Get, Query } from '@nestjs/common';
import { ResponseHelper } from 'helper/common/response.helper';
import { Public } from 'src/auth/public.decorator';
import { EmployeeService } from 'src/employee/employee.service';

@Controller('test')
export class TestController {
    
}
