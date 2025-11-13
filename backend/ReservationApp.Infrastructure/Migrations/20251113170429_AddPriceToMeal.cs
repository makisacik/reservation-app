using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReservationApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPriceToMeal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "Meals",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                table: "Meals");
        }
    }
}
