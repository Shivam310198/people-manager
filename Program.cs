using Backend.Models;
using Microsoft.EntityFrameworkCore;
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173").AllowAnyMethod().AllowAnyHeader(); // x-pagination-header
                      });
});

builder.Services.AddControllers();

String connectionString = builder.Configuration.GetConnectionString("Default") ?? throw new ArgumentNullException("Connection string is Null.");
builder.Services.AddDbContext<AppDbContext>(op => op.UseNpgsql(connectionString));
var app = builder.Build();

app.UseCors(MyAllowSpecificOrigins);

app.MapControllers();

app.Run();
