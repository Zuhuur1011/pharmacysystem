namespace pharmacyproject.Models
{
    public class Medicine
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string BatchNumber { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public DateTime ExpiryDate { get; set; }
        public DateTime DateAdded { get; set; } = DateTime.Now;
    }
}
