import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    Query,
  } from '@nestjs/common';
  import { ProductService } from './product.service';
  import { ProductEntity } from './product.entity/product.entity';
  import { ResponseHelper } from 'helper/common/response.helper';
  import { ApiResponse } from 'helper/common/response.interface';
  import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
  import { Common } from './../../helper/common/common';
  
  @Controller('products')
  export class ProductController {
    constructor(private readonly services: ProductService) {}
  
    @Post()
    async create(@Body() item: ProductEntity): Promise<ApiResponse<ProductEntity>> {
      try {
        const res = await this.services.create(item);
        return ResponseHelper.success(res);
      } catch (error) {
        return ResponseHelper.error(0, error);
      }
    }
  
    @Get()
    async findAll(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 20,
      @Query() params,
    ): Promise<ApiResponse<ProductEntity[]>> {
      try {
        const [res, totalCount] = await this.services.findAll(
          page,
          limit,
          params,
        );
        return {
          statusCode: 200,
          message: 'Thành công!',
          data: res,
          meta: {
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
          },
        };
      } catch (error) {
        return ResponseHelper.error(0, error);
      }
    }
  
    @Get(':id')
    async findOne(@Param() param): Promise<ApiResponse<ProductEntity[]>> {
      try {
        const res = await this.services.findOne(param.id);
        return ResponseHelper.success(res);
      } catch (error) {
        return ResponseHelper.error(0, error);
      }
    }
    @Put()
    async update(@Body() item: ProductEntity): Promise<ApiResponse<UpdateResult>> {
      try {
        const res = await this.services.update(item);
        return ResponseHelper.success(res);
      } catch (error) {
        return ResponseHelper.error(0, error);
      }
    }
  
    @Delete(':id')
    async remove(@Param() param) {
      try {
        const res = await this.services.remove(param.id);
        return ResponseHelper.success(res);
      } catch (error) {
        return ResponseHelper.error(0, error);
      }
    }
  }
  