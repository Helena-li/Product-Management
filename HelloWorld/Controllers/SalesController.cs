using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using HelloWorld.Models;

namespace HelloWorld.Controllers
{
    public class SalesController : Controller
    {
        private readonly TaskOneContext _context;

        public SalesController(TaskOneContext context)
        {
            _context = context;
        }

        // GET: Sales
        public async Task<IActionResult> Index()
        {
            var taskOneContext = _context.Sales.Include(s => s.Customer).Include(s => s.Product).Include(s => s.Store);
            return View(await taskOneContext.ToListAsync());
        }
        public ActionResult AllSales()
        {
            var sales = _context.Sales.Include(s => s.Customer)
                .Include(s => s.Product)
                .Include(s => s.Store)
                .Select(x => new
                {
                    Id = x.Id,
                    Customer = x.Customer.Name,
                    Store = x.Store.Name,
                    Product = x.Product.Name,
                    Date = x.DateSold == null ? "" : x.DateSold.ToString("dd/MMM/yyyy"),
                    CustomerId = x.Customer.Id,
                    ProductId = x.Product.Id,
                    StoreId = x.Store.Id,
                })
                .ToList();


            return Json(sales);

        }
       
        // GET: Sales/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var sales = await _context.Sales
                .Include(s => s.Customer)
                .Include(s => s.Product)
                .Include(s => s.Store)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (sales == null)
            {
                return NotFound();
            }

            return View(sales);
        }

        // GET: Sales/Create
        public IActionResult Create()
        {
            ViewData["CustomerId"] = new SelectList(_context.Customer, "Id", "Name");
            ViewData["ProductId"] = new SelectList(_context.Product, "Id", "Name");
            ViewData["StoreId"] = new SelectList(_context.Store, "Id", "Name");
            return View();
        }

        // POST: Sales/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,ProductId,CustomerId,StoreId,DateSold")] Sales sales)
        {
            if (ModelState.IsValid)
            {
                _context.Add(sales);
                await _context.SaveChangesAsync();
                return Ok();
            }
            ViewData["CustomerId"] = new SelectList(_context.Customer, "Id", "Name", sales.CustomerId);
            ViewData["ProductId"] = new SelectList(_context.Product, "Id", "Name", sales.ProductId);
            ViewData["StoreId"] = new SelectList(_context.Store, "Id", "Name", sales.StoreId);
            return Ok();
        }

        // GET: Sales/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var sales = await _context.Sales.FindAsync(id);
            if (sales == null)
            {
                return NotFound();
            }
            ViewData["CustomerId"] = new SelectList(_context.Customer, "Id", "Name", sales.CustomerId);
            ViewData["ProductId"] = new SelectList(_context.Product, "Id", "Name", sales.ProductId);
            ViewData["StoreId"] = new SelectList(_context.Store, "Id", "Name", sales.StoreId);
            return View(sales);
        }

        // POST: Sales/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
       // [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,ProductId,CustomerId,StoreId,DateSold")] Sales sales)
        {
            if (id != sales.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(sales);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!SalesExists(sales.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return Ok();
            }
            ViewData["CustomerId"] = new SelectList(_context.Customer, "Id", "Name", sales.CustomerId);
            ViewData["ProductId"] = new SelectList(_context.Product, "Id", "Name", sales.ProductId);
            ViewData["StoreId"] = new SelectList(_context.Store, "Id", "Name", sales.StoreId);
            return Ok();
        }

        // GET: Sales/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var sales = await _context.Sales
                .Include(s => s.Customer)
                .Include(s => s.Product)
                .Include(s => s.Store)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (sales == null)
            {
                return NotFound();
            }

            return View(sales);
        }

        // POST: Sales/Delete/5
        [HttpPost, ActionName("Delete")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var sales = await _context.Sales.FindAsync(id);
            _context.Sales.Remove(sales);
            await _context.SaveChangesAsync();
            return Ok();
        }

        private bool SalesExists(int id)
        {
            return _context.Sales.Any(e => e.Id == id);
        }
    }
}
