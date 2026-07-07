using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using pharmacyproject.Data;
using pharmacyproject.Models;

namespace pharmacyproject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicinesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MedicinesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/medicines
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Medicine>>> GetMedicines()
        {
            return await _context.Medicines.ToListAsync();
        }

        // GET: api/medicines/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Medicine>> GetMedicine(int id)
        {
            var medicine = await _context.Medicines.FindAsync(id);
            if (medicine == null)
            {
                return NotFound();
            }
            return medicine;
        }

        // POST: api/medicines
        [HttpPost]
        public async Task<ActionResult<Medicine>> PostMedicine(Medicine medicine)
        {
            _context.Medicines.Add(medicine);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMedicine), new { id = medicine.Id }, medicine);
        }

        // PUT: api/medicines/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMedicine(int id, Medicine medicine)
        {
            if (id != medicine.Id)
            {
                return BadRequest();
            }
            _context.Entry(medicine).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/medicines/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicine(int id)
        {
            var medicine = await _context.Medicines.FindAsync(id);
            if (medicine == null)
            {
                return NotFound();
            }
            _context.Medicines.Remove(medicine);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}