import {expect} from 'chai';
import assert from 'assert';
import TickEntry from './../src/lib/TickEntry'
import {ErrorMsg} from './../src/lib/contants'

let ticker;

function func(){
	return 'called later';
}
/** @test {TickEntry} */
describe('API', ()=>{

	beforeEach(()=>{
		ticker = new TickEntry(func);
	});

	afterEach(()=>{
		ticker = null;
	});

	/** @test {TickEntry#executeInCycle} */
	describe('executeInCycle', ()=>{
		it('Should call function in next animation frame', (done)=>{
			ticker.executeInCycle();
			expect(ticker.executionCount).equal(0);
			setTimeout(()=>{
				expect(ticker.executionCount).equal(1);
				done();
			},0);
		});
		it('function reference has to be retained on Done', (done)=>{
			const func = ticker.func;
			ticker.executeInCycle().onDone(()=>{
				expect(ticker.func).equal(func);
				done();
			});
			expect(ticker.func).to.not.equal(func);
		});
		it('Should call onDone handler with result if provided', (done)=>{
			ticker.onDone(function(result){
				expect(ticker.executionCount).equal(1);
				expect(result).equal('called later');
				done();
			});
			ticker.executeInCycle()
		});
		it('Should throw error when function is not defined', ()=>{
			ticker.func = null;
			try{
				ticker.executeInCycle();
			}catch(error){
				expect(error.message).equal("Ticker: function can't be undefined");
			}
		});
		it('Should throw error when instance is null', ()=>{
			try{
				ticker.executeInCycle.call(null);
			}catch(error){
				expect(error.message).equal("Ticker: instance can't be null");
			}
		});
		it('Should throw error when instance is not Ticker', ()=>{
			try{
				ticker.executeInCycle.call(window);
			}catch(error){
				expect(error.message).equal(`Ticker: Expecting instance of TickEntry got ${window.constructor.name}`);
			}
		});
		it('Should call onError handler when error is thrown', (done)=>{
			ticker.func = function(){
				throw new Error("Error Thrown");
			};
			ticker.onError(function(error){
				expect(error.message).equal('Error Thrown');
				done();
			});
			ticker.executeInCycle()
		});

	});
	/** @test {TickEntry#executeAsSmallLoopsInCycle} */
	describe('executeAsSmallLoopsInCycle', ()=>{

		it('Should call function in next animation frame', (done)=>{
			ticker.executeAsSmallLoopsInCycle(1, 1);
			setTimeout(()=>{
				expect(ticker.executionCount).equal(1);
				done();
			},0);
		});


		it('Should call onProgress and onDone handler', (done)=>{
			var maxLoopPerFrame = 10;
			var endIndex = 30;
			let progressIndex = maxLoopPerFrame;
			ticker.executeAsSmallLoopsInCycle(maxLoopPerFrame, endIndex)
			.onProgress(function(index){
				expect(progressIndex).equal(index);
				progressIndex = progressIndex + maxLoopPerFrame;
			})
			.onDone(function(){
				expect(ticker.executionCount).equal(1);
				done();
			});
		});

		it('function reference has to be retained on Done', (done)=>{
			const func = ticker.func;
			ticker.executeAsSmallLoopsInCycle(10, 30).onDone(()=>{
				expect(ticker.func).equal(func);
				done();
			});
			expect(ticker.func).to.not.equal(func);
		});

		it('Should call error Handler if there is error in for loop code ', (done)=>{
			ticker.func = function(){
				throw new Error("Error Thrown");
			};

			ticker.executeAsSmallLoopsInCycle(10, 30)
			.onError(function(error){
				expect(error.message).equal("Error Thrown");
				done();
			})
		});
		it('Should throw error when function is not defined', ()=>{
			ticker.func = null;
			try{
				ticker.executeAsSmallLoopsInCycle(34,20);
			}catch(error){
				expect(error.message).equal("Ticker: function can't be undefined");
			}
		});
		it('Should throw error when maxLoopPerframe is not defined', ()=>{
			try{
				ticker.executeAsSmallLoopsInCycle();
			}catch(error){
				expect(error.message).equal(ErrorMsg.MAX_LOOP_PER_FRAME);
			}
		});
		it('Should throw error when maxLoopPerframe is not a number', ()=>{
			try{
				ticker.executeAsSmallLoopsInCycle("34");
			}catch(error){
				expect(error.message).equal(ErrorMsg.MAX_LOOP_PER_FRAME);
			}
		});
		it('Should throw error when End index is not defined', ()=>{
			try{
				ticker.executeAsSmallLoopsInCycle(10);
			}catch(error){
				expect(error.message).equal(ErrorMsg.END_INDEX);
			}
		});
		it('Should throw error when End index is not a number', ()=>{
			try{
				ticker.executeAsSmallLoopsInCycle(10, "20");
			}catch(error){
				expect(error.message).equal(ErrorMsg.END_INDEX);
			}
		});
		it('Should throw error when Start index is not a number', ()=>{
			try{
				ticker.executeAsSmallLoopsInCycle(10,30, "45");
			}catch(error){
				expect(error.message).equal(ErrorMsg.START_INDEX);
			}
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
		it('Should set notifier to null', ()=>{
			ticker.dispose();
			expect(ticker.notifier).equal(null);
		});
		it('Should set executionCount to NaN', ()=>{
			ticker.dispose();
			expect(ticker.executionCount).to.be.NaN;
		});
	})
});