import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { BooksService } from "./books.service";
import { BooksEntity } from "./entity/books.entity";
import { ResponseHelper } from "helper/common/response.helper";
import { ApiResponse } from "helper/common/response.interface";
import { UpdateResult } from "typeorm/query-builder/result/UpdateResult";
import { Common } from "./../../helper/common/common";
import { EmployeeService } from "src/employee/employee.service";
import { CustomerService } from "src/customer/customer.service";
import { UserService } from "src/user/user.service";
import { log } from "console";
import { Public } from "src/auth/public.decorator";

@Controller("books")
export class BooksController {
  constructor(
    private readonly services: BooksService,
    private readonly employeeServices: EmployeeService,
    private readonly customerServices: CustomerService,
    private readonly userServices: UserService
  ) { }

  @Post()
  async create(@Body() body): Promise<ApiResponse<BooksEntity>> {
    try {
      if (await Common.verifyRequest(body.cksRequest, body.timeRequest)) {
        const employee = await this.employeeServices.findOne(body.idEmployee);
        const customer = await this.customerServices.findOne(body.idCustomer);
        const user = await this.userServices.findOne(body.store_id);
        if (employee && customer && user) {
          const res = await this.services.create(body);
          return ResponseHelper.success(res);
        } else {
          return ResponseHelper.error(
            0,
            "Mã cửa hàng/nhân viên/khach hàng không tồn tại"
          );
        }
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 20,
    @Query() query
  ): Promise<ApiResponse<BooksEntity[]>> {
    try {
      if (await Common.verifyRequest(query.cksRequest, query.timeRequest)) {
        const [res, totalCount] = await this.services.findAll(
          page,
          limit,
          query
        );
        return {
          statusCode: 200,
          message: "Thành công!",
          data: res,
          meta: {
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
          },
        };
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Public()
  @Get('RpEachEmployee')
  async RpEachEmployee(
    @Query() query
  ): Promise<ApiResponse<BooksEntity[]>> {
    try {
      const listEmployee = await this.employeeServices.getAllEmployee(query.store_id);
      const listBook = await this.services.getAllBooks(query);
      if (listBook.length <= 0) {
        return ResponseHelper.error(0, "không có dữ liệu");
      }
      // console.log("listEmployee: " + JSON.stringify(listEmployee))
      // console.log("listBook: " + JSON.stringify(listBook))


      var res: any
      var listRP: any = []
      var totalBook = {
        money: 0,
        book: listBook.length
      }

      // tinh bieu do theo ngay



      var chartDay = []
      for (let i = 0; i < listBook.length; i++) {// lap danh sach book
        const chartDayData = {
          date: await Common.formatDateFromMilliseconds(listBook[i].start),
          money: listBook[i].amount
        }
        chartDay.push(chartDayData)
      }
      const totalAmountByDay = await Common.calculateTotalAmountByDay(chartDay);
      // console.log(totalAmountByDay);



      // ket thuc
      // tinh tong tien va so lan dat cho cua trong thoi gian va nhan vien
      listEmployee.forEach(e => {// lap danh sach nhan vien
        var totalMoneyEmpl = 0
        var tolalBookEmpl = 0
        for (let index = 0; index < listBook.length; index++) {// lap danh sach book
          const element = listBook[index];
          if (element.idEmployee == e.id) { // trung id thi cong tong vao
            totalMoneyEmpl += element.amount
            tolalBookEmpl++
          }
        }
        listRP.push({ // dua vao danh sach
          idEmployee: e.id,
          name: e.fullName,
          totalMoney: totalMoneyEmpl,
          tolalBook: tolalBookEmpl
        })
        totalBook.money += totalMoneyEmpl
      });
      //ket thuc
      res = {
        chartDay: totalAmountByDay,
        totalBook: totalBook,
        listEmplEach: listRP
      }
      // console.log("listBook: " + JSON.stringify(listRP))
      return {
        statusCode: 200,
        message: "Thành công!",
        data: res
      };
      // }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Get(":id")
  async findOne(
    @Param() param,
    @Query() query
  ): Promise<ApiResponse<BooksEntity>> {
    try {
      if (await Common.verifyRequest(query.cksRequest, query.timeRequest)) {
        const res = await this.services.findOne(param.id);
        return ResponseHelper.success(res);
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }
  @Put()
  async update(@Body() body): Promise<ApiResponse<any>> {
    try {
      if (await Common.verifyRequest(body.cksRequest, body.timeRequest)) {
        const book = await this.services.findOne(body.id);
        if (body.status > 3) {
          return ResponseHelper.error(0, "Lỗi1");
        }
        delete body["cksRequest"];
        delete body["timeRequest"];
        const updateBook = await this.services.update(body);

        if (updateBook.affected == 1 && book.status != 1 && body.status == 1) {
          const customer = await this.customerServices.findOne(body.idCustomer);
          customer.loyalty = customer.loyalty + book.amount;
          const updateCustomer = await this.customerServices.update(customer);

          if (updateCustomer.affected == 1) {
            return ResponseHelper.success(200, "Thành công");
          }
        } else if (updateBook.affected == 1) {
          return ResponseHelper.success(updateBook);
        }
      }
      return ResponseHelper.error(0, "Lỗi2");
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Delete(":id")
  async remove(@Param() param, @Query() query) {
    try {
      if (await Common.verifyRequest(query.cksRequest, query.timeRequest)) {
        const res = await this.services.remove(param.id);
        return ResponseHelper.success(res);
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }
}
