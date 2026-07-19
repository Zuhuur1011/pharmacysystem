using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using pharmacyproject.Data;
using pharmacyproject.Services;

namespace pharmacyproject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlertsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly EmailService _emailService;

        public AlertsController(AppDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        [HttpPost("send-expiry-email")]
        public async Task<IActionResult> SendExpiryEmail([FromQuery] string toEmail)
        {
            var today = DateTime.Now;
            var soon = today.AddDays(30);

            var medicines = await _context.Medicines.ToListAsync();
            var expired = medicines.Where(m => m.ExpiryDate < today).ToList();
            var expiring = medicines.Where(m => m.ExpiryDate >= today && m.ExpiryDate <= soon).ToList();

            if (expired.Count == 0 && expiring.Count == 0)
            {
                return Ok(new { message = "No alerts to send. All medicines are in good condition." });
            }

            var body = "Pharmacy Expiry Alert Report\n\n";

            if (expired.Count > 0)
            {
                body += "EXPIRED MEDICINES:\n";
                foreach (var med in expired)
                {
                    body += $"- {med.Name} (Batch: {med.BatchNumber}, Qty: {med.Quantity}, Expired: {med.ExpiryDate:MM/dd/yyyy})\n";
                }
                body += "\n";
            }

            if (expiring.Count > 0)
            {
                body += "EXPIRING WITHIN 30 DAYS:\n";
                foreach (var med in expiring)
                {
                    body += $"- {med.Name} (Batch: {med.BatchNumber}, Qty: {med.Quantity}, Expires: {med.ExpiryDate:MM/dd/yyyy})\n";
                }
            }

            await _emailService.SendEmailAsync(toEmail, "Pharmacy Expiry Alert", body);

            return Ok(new { message = $"Alert email sent to {toEmail}." });
        }
    }
}