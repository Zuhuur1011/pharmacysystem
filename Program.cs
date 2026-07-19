using Microsoft.EntityFrameworkCore;
using pharmacyproject.Data;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite("Data Source=pharmacy.db"));
builder.Services.AddScoped<pharmacyproject.Services.EmailService>();

var app = builder.Build(); 
app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
