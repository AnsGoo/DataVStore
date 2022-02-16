import {MigrationInterface, QueryRunner} from "typeorm";

export class first1641198349340 implements MigrationInterface {
    name = 'first1641198349340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`file\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`md5\` varchar(255) NOT NULL, \`url\` text NOT NULL, \`createTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_66027a8bd3581665d9202f9afb\` (\`md5\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`page\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`author\` varchar(200) NOT NULL, \`thumbnail\` varchar(200) NULL, \`isHome\` tinyint NOT NULL DEFAULT 0, \`isDelete\` tinyint NOT NULL DEFAULT 0, \`canvasData\` json NOT NULL, \`canvasStyle\` json NOT NULL, \`createTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX \`IDX_0efb094b11b76510bda6e58d69\` (\`author\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_0efb094b11b76510bda6e58d69\` ON \`page\``);
        await queryRunner.query(`DROP TABLE \`page\``);
        await queryRunner.query(`DROP INDEX \`IDX_66027a8bd3581665d9202f9afb\` ON \`file\``);
        await queryRunner.query(`DROP TABLE \`file\``);
    }

}
