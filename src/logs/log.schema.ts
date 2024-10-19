import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export enum LogAction {
  GET_ISSUES = 'get_issues',
  GET_SINGLE_ISSUE = 'get_issue'
}

export class Log extends Document {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @Prop({ required: true })
  ip: string;

  @ApiProperty()
  @Prop({ required: true, enum: LogAction })
  action: LogAction;

  @ApiProperty()
  @Prop({ required: true })
  dateTime: Date;
}


const LogSchema = SchemaFactory.createForClass(Log);

LogSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
});

export { LogSchema };
