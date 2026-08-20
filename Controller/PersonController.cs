using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PeopleController : ControllerBase
{
    //POST /api/people
    //GET /api/people
    //GET /api/people/{id}
    //PUT /api/people/{id} {body}
    //DELETE /api/people/{id}
    private readonly AppDbContext _context;

    public PeopleController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> AddPerson(Person person)
    {
        try
        {
            _context.People.Add(person);
            await _context.SaveChangesAsync();
            return CreatedAtRoute("GetPerson", new { id = person.PersonId }, person); // 200 ok status code with the added person object
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetPeople()
    {
        try
        {
            var people = await _context.People.ToListAsync();
            return Ok(people); // 200 ok status code with the list of people

        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }

    [HttpGet("{id:int}", Name = "GetPerson")]
    public async Task<IActionResult> GetPersonAsync(int id)
    {
        try
        {
            var person = await _context.People.FindAsync(id);
            if (person == null)
            {
                return NotFound(); // 404 not found status code if person with the given id does not exist
            }
            return Ok(person); // 200 ok status code with the found person object
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }


    [HttpPut("{PersonID:int}")]
    public async Task<IActionResult> UpdatePerson(int PersonID, [FromBody] Person person)
    {
        try
        {
            if (PersonID != person.PersonId)
            {
                return BadRequest("Id in URL and body do not match"); // 400 bad request status code if the id in the url does not match the id in the body
            }
            if (!await _context.People.AnyAsync(p => p.PersonId == PersonID))
            {
                return NotFound(); // 404 not found status code if person with the given id does not exist
            }
            _context.People.Update(person);
            await _context.SaveChangesAsync();
            return NoContent(); // 204 no content status code
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }

    [HttpDelete("{PersonID:int}")]
        public async Task<IActionResult> DeletePerson(int PersonID)
        {
            try
        {
            var person = await _context.People.FindAsync(PersonID);
            if (person is null)
            {
                return NotFound(); // 404 not found status code if person with the given id does not exist
            }
            _context.People.Remove(person);
            await _context.SaveChangesAsync();
            return NoContent(); // 204 no content status code
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
        }
    }



