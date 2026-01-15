using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Recruitment.API.Migrations
{
    /// <inheritdoc />
    public partial class addFollow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "bio",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "coverImageUrl",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "defaultCvUrl",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "githubUrl",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "linkedInUrl",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "professionalTitle",
                table: "Users",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "websiteUrl",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Follow",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false),
                    employerId = table.Column<int>(type: "int", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    followerId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Follow", x => new { x.id, x.employerId });
                    table.ForeignKey(
                        name: "FK_Follow_Users_employerId",
                        column: x => x.employerId,
                        principalTable: "Users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Follow_Users_id",
                        column: x => x.id,
                        principalTable: "Users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Follow_employerId",
                table: "Follow",
                column: "employerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Follow");

            migrationBuilder.DropColumn(
                name: "bio",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "coverImageUrl",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "defaultCvUrl",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "githubUrl",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "linkedInUrl",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "professionalTitle",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "websiteUrl",
                table: "Users");
        }
    }
}
