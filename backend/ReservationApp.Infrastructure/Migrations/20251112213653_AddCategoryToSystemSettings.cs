using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReservationApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryToSystemSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_SystemSettings_Key",
                table: "SystemSettings");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "SystemSettings",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            // Set default categories for existing settings
            migrationBuilder.Sql(@"
                UPDATE ""SystemSettings""
                SET ""Category"" = 'Reservation'
                WHERE ""Key"" IN ('MaxWeeklyReservations', 'AllowPastReservations', 'AllowSameDayReservations', 'CancellationNoticeHours', 'AutoApproval');
            ");

            // Make Category non-nullable after setting defaults
            migrationBuilder.AlterColumn<string>(
                name: "Category",
                table: "SystemSettings",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_SystemSettings_Category_Key",
                table: "SystemSettings",
                columns: new[] { "Category", "Key" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_SystemSettings_Category_Key",
                table: "SystemSettings");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "SystemSettings");

            migrationBuilder.CreateIndex(
                name: "IX_SystemSettings_Key",
                table: "SystemSettings",
                column: "Key",
                unique: true);
        }
    }
}
