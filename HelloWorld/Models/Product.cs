using System;
using System.Collections.Generic;

namespace HelloWorld.Models
{
    public partial class Product
    {
        public Product()
        {
            Sales = new HashSet<Sales>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }

        public virtual ICollection<Sales> Sales { get; set; }
    }
}
