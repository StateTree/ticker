import {expect} from 'chai';
import assert from 'assert';
import TickEntry from './../src/lib/TickEntry'

let ticker;

function func(){
	return 'called later';
}
/** @test {TickEntry} */
describe('API', ()=>{

	beforeEach(()=>{
		ticker = new TickEntry(null,func);
	});

	afterEach(()=>{
		ticker = null;
	});

	/** @test {TickEntry#executeInCycle} */
	describe('executeInCycle', ()=>{
		it('Should call function in next animation frame', (done)=>{
			ticker.executeInCycle();
			setTimeout(()=>{
				expect(ticker.executionCount).equal(1);
				done();
			},0);
		});
		it('Should throw error when function is not defined', ()=>{
			ticker.func = null;
			assert.throws(ticker.executeInCycle, Error, "Ticker: function can't be undefined");
		});
	});
	/** @test {TickEntry#executeAsSmallLoopsInCycle} */
	describe('executeAsSmallLoopsInCycle', ()=>{
		it('Should throw error when function is not defined', ()=>{
			ticker.func = null;
			assert.throws(ticker.executeAsSmallLoopsInCycle, Error, "Ticker: function can't be undefined");
		})
		it('Should call function in next animation frame', (done)=>{
			ticker.executeAsSmallLoopsInCycle(10, 100);
			setTimeout(()=>{
				expect(ticker.executionCount).equal(1);
				done();
			},0);
		});

		it('Should call callback with current executed index ', (done)=>{
			var maxLoopPerFrame = 10;
			var endIndex = 30;
			ticker.callback = function(index){
				var loopCount = (index/ maxLoopPerFrame);
				expect(ticker.executionCount).equal(loopCount);
				if(index == endIndex){
					done();
				}
			}

			ticker.executeAsSmallLoopsInCycle(maxLoopPerFrame, endIndex);
		});
	});
	/** @test {TickEntry#dispose} */
	describe('dispose', ()=>{
		it('Should set context to null', ()=>{
			ticker.dispose();
			expect(ticker.context).equal(null);
		});
		it('Should set func to null', ()=>{
			ticker.dispose();
			expect(ticker.func).equal(null);
		});
		it('Should set callback to null', ()=>{
			ticker.dispose();
			expect(ticker.callback).equal(null);
		});
		it('Should set executionCount to NaN', ()=>{
			ticker.dispose();
			expect(ticker.executionCount).to.be.NaN;
		});
	})
});