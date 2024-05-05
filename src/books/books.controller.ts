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
    @Query("limit") limit: number = 100,
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

  @Get("theonhanvienhoackhachhang")
  async findAllTheoNhanVienHoacKhachHang(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 100,
    @Query() query
  ): Promise<ApiResponse<BooksEntity[]>> {
    try {
      if (await Common.verifyRequest(query.cksRequest, query.timeRequest)) {
        const [res, totalCount] = await this.services.findAll2(
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

  @Get("bookinsuccess")
  async getAllBookInSuccess(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 100,
    @Query() query
  ): Promise<ApiResponse<BooksEntity[]>> {
    try {
      if (await Common.verifyRequest(query.cksRequest, query.timeRequest)) {
        const [res, totalCount] = await this.services.getAllBookInSuccess(
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

  @Get("dangphucvu")
  async getAllBookDangPhucVu(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 100,
    @Query() query
  ): Promise<ApiResponse<BooksEntity[]>> {
    try {
      if (await Common.verifyRequest(query.cksRequest, query.timeRequest)) {
        const [res, totalCount] = await this.services.getAllBookDangPhucVu(
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

  // @Public()
  @Get('report')
  async Report(
    @Query() query
  ): Promise<ApiResponse<BooksEntity[]>> {
    try {
      
      const listEmployee = await this.employeeServices.getAllEmployee(query.store_id);
      const listBook = await this.services.getAllBooks(query);
      // log("listBook"+listBook.length)
      // log("listEmployee"+ listEmployee.length)
      if (listBook.length <= 0 || listEmployee.length <= 0) {
        return ResponseHelper.error(0, "không có dữ liệu");
      }
      var res: any
      var listRP: any = []
      var chartDay = []
      var totalBook = {
        money: 0,
        book: listBook.length
      }


      for (let i = 0; i < listBook.length; i++) {// lap danh sach bieu do
        const chartDayData = {
          date: await Common.formatDateFromMilliseconds(listBook[i].start),
          money: listBook[i].amount
        }
        chartDay.push(chartDayData)
      }
      const totalAmountByDay = await Common.calculateTotalAmountByDay(chartDay);
      // console.log(totalAmountByDay);
      // log("totalAmountByDay"+totalAmountByDay.length)


      // ket thuc
      // tinh tong tien va so lan dat cho trong thoi gian va nhan vien
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
      // //ket thuc
      // log("wqweqwe")
      // log("totalBook"+totalBook)
      // log("listEmplEach"+listRP.length)
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

  @Get("doanhthunhanvien")
  async doanhthunhanvien(
    @Query() query
  ): Promise<ApiResponse<BooksEntity>> {
    try {
      // console.log("doanhthunhanvien")
      if (await Common.verifyRequest(query.cksRequest, query.timeRequest)) {
        
        const res = await this.services.layTongDoanhThuNhanVien(query.store_id,query.idEmployee);
        // console.log(res)
        return ResponseHelper.success(res);
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Get("tongluotkhachhang")
  async tongLuotKhachHang(
    @Query() query
  ): Promise<ApiResponse<BooksEntity>> {
    try {
      console.log("tongluotkhachhang")
      if (await Common.verifyRequest(query.cksRequest, query.timeRequest)) {
        
        const res = await this.services.layTongLuotLamKhachHang(query.store_id,query.idCustomer);
        // console.log(res)
        return ResponseHelper.success(res);
      }
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

          //cap nhat die cho khach hang
          let trangThaiCapNhat: number = 0
          const customer = await this.customerServices.findOne(body.idCustomer);
          var tongDiem: number = 0
          const dsDichVu  = JSON.parse(""+book.listService)
          dsDichVu.forEach(e => {
            tongDiem += e.point
          });
        
          
          customer.loyalty = customer.loyalty + tongDiem;
          const updateCustomer = await this.customerServices.update(customer);

          if (updateCustomer.affected == 1) {
            trangThaiCapNhat = 1
          }

          //cap nhat luot cho nhan vien
          const employee = await this.employeeServices.findOne(body.idEmployee);
          employee.luotKhach = employee.luotKhach + 1;
          const updateEmployee = await this.employeeServices.update(employee);

          if (updateEmployee.affected == 1) {
            trangThaiCapNhat = 2
          }

          if (trangThaiCapNhat == 2) {
            return ResponseHelper.success(updateBook);
          }else {
            return ResponseHelper.error(0, "Lỗi cập nhật điểm");
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
