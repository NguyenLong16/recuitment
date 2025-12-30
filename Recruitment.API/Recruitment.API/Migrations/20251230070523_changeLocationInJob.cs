using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Recruitment.API.Migrations
{
    /// <inheritdoc />
    public partial class changeLocationInJob : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Jobs_Locations_Locationid",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "location",
                table: "Jobs");

            migrationBuilder.RenameColumn(
                name: "Locationid",
                table: "Jobs",
                newName: "locationId");

            migrationBuilder.RenameIndex(
                name: "IX_Jobs_Locationid",
                table: "Jobs",
                newName: "IX_Jobs_locationId");

            migrationBuilder.AlterColumn<int>(
                name: "locationId",
                table: "Jobs",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Jobs_Locations_locationId",
                table: "Jobs",
                column: "locationId",
                principalTable: "Locations",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Jobs_Locations_locationId",
                table: "Jobs");

            migrationBuilder.RenameColumn(
                name: "locationId",
                table: "Jobs",
                newName: "Locationid");

            migrationBuilder.RenameIndex(
                name: "IX_Jobs_locationId",
                table: "Jobs",
                newName: "IX_Jobs_Locationid");

            migrationBuilder.AlterColumn<int>(
                name: "Locationid",
                table: "Jobs",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "location",
                table: "Jobs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Jobs_Locations_Locationid",
                table: "Jobs",
                column: "Locationid",
                principalTable: "Locations",
                principalColumn: "id");
        }
    }
}
