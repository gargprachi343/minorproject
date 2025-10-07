import mongoose, { Schema, Document, models, Model } from 'mongoose'

export interface IAttendance extends Document {
    userId: mongoose.Types.ObjectId
    entryTime: Date
    exitTime?: Date
}

const attendanceSchema: Schema<IAttendance> = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        entryTime: { type: Date, default: Date.now },
        exitTime: { type: Date },
    },
    {
        timestamps: true,
    }
)

const Attendance: Model<IAttendance> =
    models.Attendance ||
    mongoose.model<IAttendance>('Attendance', attendanceSchema)

export default Attendance
