using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Recruitment.API.Migrations
{
    /// <inheritdoc />
    public partial class RebuildCompanyIdLogic : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Jobs_Companies_companyId",
                table: "Jobs");

            migrationBuilder.AddColumn<int>(
                name: "companyId",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "companyId",
                table: "Jobs",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_companyId",
                table: "Users",
                column: "companyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Jobs_Companies_companyId",
                table: "Jobs",
                column: "companyId",
                principalTable: "Companies",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Companies_companyId",
                table: "Users",
                column: "companyId",
                principalTable: "Companies",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Jobs_Companies_companyId",
                table: "Jobs");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Companies_companyId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_companyId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "companyId",
                table: "Users");

            migrationBuilder.AlterColumn<int>(
                name: "companyId",
                table: "Jobs",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Jobs_Companies_companyId",
                table: "Jobs",
                column: "companyId",
                principalTable: "Companies",
                principalColumn: "id");
        }
    }
}
