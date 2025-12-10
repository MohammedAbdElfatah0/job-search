
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {

        if (context.getType<string>() === 'graphql') {
            return next.handle(); // مفيش تعديل للـ response
        }
        return next.handle().pipe(map(data => ({
            message: data?.message ?? "Done",
            success: true,
            data: data.data
        })));
    }
}
