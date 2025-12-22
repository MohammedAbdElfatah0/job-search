import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ApplicationStatus } from "../../common";
import {
    ApplicationRepository,
    CompanyRepository,
    JobOpportunityRepository,
    UserRepository
} from "../../DB";

@Injectable()
export class TasksService implements OnModuleInit {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        private readonly userRepository: UserRepository,
        private readonly companyRepository: CompanyRepository,
        private readonly jobRepository: JobOpportunityRepository,
        private readonly applicationRepository: ApplicationRepository,
    ) { }
    onModuleInit() {
        this.logger.log("TasksService initialized, cron jobs are active");
    }


    @Cron("0 0 */6 * * *")
    async cleanExpiredOtps(): Promise<void> {
        const now = new Date();

        try {
            const result = await this.userRepository.updateMany(
                { "otp.expire": { $lt: now } },
                { $pull: { otp: { expire: { $lt: now } } } }
            );

            this.logger.log(
                `Expired OTPs cleaned from ${result.modifiedCount} users`
            );
        } catch (error) {
            this.logger.error(
                "Failed to clean expired OTPs",
                error instanceof Error ? error.stack : undefined
            );
        }
    }


    @Cron(CronExpression.EVERY_DAY_AT_NOON)
    async purgeSoftDeletedRecords(): Promise<void> {
        const now = new Date();

        this.logger.log("Daily cleanup job started");

        try {
            await Promise.all([
                this.cleanUsers(now),
                this.cleanCompanies(now),
                this.cleanApplications(now),
                this.cleanJobs(now),
            ]);

            this.logger.log("Daily cleanup job finished successfully");
        } catch (error) {
            this.logger.error(
                "Daily cleanup job failed",
                error instanceof Error ? error.stack : undefined
            );
        }
    }

    // ---------- Private  Methods ----------

    private async cleanUsers(date: Date): Promise<void> {
        await this.userRepository.deleteMany({
            deletedAt: { $lt: date },
        });
    }

    private async cleanCompanies(date: Date): Promise<void> {
        await this.companyRepository.deleteMany({
            deletedAt: { $lt: date },
        });
    }

    private async cleanApplications(date: Date): Promise<void> {
        await this.applicationRepository.deleteMany({
            status: ApplicationStatus.ACCEPTED,
            deletedAt: { $lt: date },
        });
    }

    private async cleanJobs(date: Date): Promise<void> {
        await this.jobRepository.deleteMany({
            deletedAt: { $lt: date },
        });
    }
}
