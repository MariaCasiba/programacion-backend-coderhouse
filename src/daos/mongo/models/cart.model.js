import mongoose from 'mongoose';



        const cartSchema = new mongoose.Schema({
            products: [{
                    product: { type: mongoose.Schema.Types.ObjectId,
                    ref: 'products' },
                    quantity: { type: Number, min: 0, default: 1 }
            }]
        });

        cartSchema.pre('findOne', function(){
            this.populate('products.product')
        })

export const cartModel = mongoose.model('carts', cartSchema);

